import React from 'react'
import PageHeader from '../components/PageHeader.jsx'
import SpinnerOverlay from '../components/SpinnerOverlay.jsx'
import { recognizeFace } from '../services/attendanceService'
import { useToast } from '../context/ToastContext.jsx'

export default function LiveAttendancePage() {
  const { pushToast } = useToast()
  const videoRef = React.useRef(null)
  const canvasRef = React.useRef(null)
  const streamRef = React.useRef(null)
  const intervalRef = React.useRef(null)
  const [loading, setLoading] = React.useState(true)
  const [cameraError, setCameraError] = React.useState('')
  const [recognized, setRecognized] = React.useState([])
  const [busy, setBusy] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        if (cancelled) return
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setLoading(false)
        setCameraError('')
      } catch {
        setCameraError('Camera permission denied or unavailable. Please allow webcam access.')
        setLoading(false)
      }
    }
    startCamera()
    return () => {
      cancelled = true
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  React.useEffect(() => {
    if (loading || cameraError) return

    intervalRef.current = window.setInterval(async () => {
      if (!videoRef.current || !canvasRef.current || busy || videoRef.current.readyState < 2) return

      try {
        setBusy(true)
        const width = 480
        const height = 320
        const context = canvasRef.current.getContext('2d')
        canvasRef.current.width = width
        canvasRef.current.height = height
        context.drawImage(videoRef.current, 0, 0, width, height)

        const blob = await new Promise((resolve) => canvasRef.current.toBlob(resolve, 'image/jpeg', 0.85))
        if (!blob) return

        const formData = new FormData()
        formData.append('image', blob, 'capture.jpg')
        const response = await recognizeFace(formData)

        if (response?.result === 'matched') {
          const label = `${response.name} (${response.employee_id})`
          setRecognized((current) => [label, ...current.filter((item) => item !== label)].slice(0, 8))
          pushToast(`Attendance marked for ${response.name}`, 'success')
        } else if (response?.result === 'unknown') {
          pushToast('Unknown face detected.', 'info')
        }
      } catch {
        pushToast('Recognition request failed. Check the backend API.', 'error')
      } finally {
        setBusy(false)
      }
    }, 2200)

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [busy, cameraError, loading, pushToast])

  if (loading) return <SpinnerOverlay message="Starting webcam stream..." />

  return (
    <div>
      <PageHeader title="Live Attendance" subtitle="Webcam recognition with real-time attendance marking and notifications." />

      {cameraError ? <div className="panel border border-danger text-danger mb-4">{cameraError}</div> : null}

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="panel">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <div>
                <div className="fw-bold">Camera Feed</div>
                <div className="muted small">The backend receives periodic snapshots for face recognition.</div>
              </div>
              <span className="status-pill">{busy ? 'Scanning...' : 'Live'}</span>
            </div>

            <div className="camera-frame">
              <video ref={videoRef} playsInline muted autoPlay />
              <canvas ref={canvasRef} className="d-none" />
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="panel h-100">
            <div className="fw-bold mb-3">Recognized Employees</div>
            {recognized.length ? (
              <div className="d-grid gap-2">
                {recognized.map((item) => <div key={item} className="glass-card p-3">{item}</div>)}
              </div>
            ) : (
              <div className="glass-card p-4 muted">No recognition events yet.</div>
            )}
            <div className="muted small mt-3">Grant camera access when prompted to begin scanning.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
