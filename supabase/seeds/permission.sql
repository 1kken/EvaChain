--create permission review_ipcr
INSERT INTO
    permissions (name, description)
VALUES
    (
        'review_ipcr',
        'This permission can be attached to any roles that has the capabilties to review an ipcr'
    );

-- Insert operational plan permissions
INSERT INTO
    permissions (name, description)
VALUES
    (
        'create_operational_plan',
        'Permission to create operational plans'
    ),
    (
        'edit_operational_plan',
        'Permission to edit operational plans'
    ),
    (
        'delete_operational_plan',
        'Permission to delete operational plans'
    );