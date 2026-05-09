from backend.database import db

class Employee(db.Model):
    __tablename__ = 'employees'
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    image_path = db.Column(db.String(255), nullable=True)
    encoding = db.Column(db.Text, nullable=False)  # Stored as JSON string
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'name': self.name,
            'department': self.department,
            'image_path': self.image_path,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
