--create permission review_ipcr
INSERT INTO
    permissions (name, description)
VALUES
    (
        'review_ipcr',
        'This permission can be attached to any roles that has the capabilties to review an ipcr'
    );