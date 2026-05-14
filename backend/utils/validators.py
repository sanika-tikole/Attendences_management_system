def validate_employee_payload(name, employee_id, department, image_file):
    errors = {}

    if not employee_id or not str(employee_id).strip():
        errors["employee_id"] = "Employee ID is required."
    if not name or not str(name).strip():
        errors["name"] = "Name is required."
    if not department or not str(department).strip():
        errors["department"] = "Department is required."
    if image_file is None:
        errors["image"] = "Employee image is required."

    return errors
