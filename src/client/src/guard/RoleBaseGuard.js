

const useCurrentRole = () => {
    // Logic here to get current user role
    const role = 'admin'
    return role
}

export default function RoleBasedGuard({ accessibleRoles, children }) {
    const currentRole = useCurrentRole();

    if (!accessibleRoles.includes(currentRole)) {
        return (
            <div style={{marginTop: "200px"}}>
                <main>
                    <h1>Permission Denied</h1>
                    You do not have permission to access this page
                </main>
            </div>
        );
    }

    return <>{children}</>;
}