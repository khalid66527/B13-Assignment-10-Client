import React from 'react';
import UsersTable from './UsersTable';
import { getAllUsers } from '@/lib/api/alluser';

const ManageUsers = async () => {
    let allUsers = [];
    let fetchError = false;

    try {
        allUsers = await getAllUsers();
    } catch (error) {
        console.error("Failed to fetch users from backend:", error);
        fetchError = true;
    }

    return (
        <div className="space-y-8">
            <UsersTable initialUsers={allUsers || []} fetchError={fetchError} />
        </div>
    );
};

export default ManageUsers;