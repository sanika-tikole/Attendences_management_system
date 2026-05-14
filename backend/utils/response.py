from flask import jsonify


def success(data=None, message="OK", status=200):
    payload = {"success": True, "message": message, "data": data}
    return jsonify(payload), status


def fail(message="Bad request", status=400, errors=None):
    payload = {"success": False, "message": message, "errors": errors}
    return jsonify(payload), status
