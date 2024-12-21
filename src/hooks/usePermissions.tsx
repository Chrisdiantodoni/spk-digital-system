import { useEffect } from 'react';
import authentication from '../Services/API/authentication';
import createStore from '../context';

// Custom hook to fetch and update permission data
export const usePermissionQuery = () => {
  const handle = createStore((state) => state.handle);

  useEffect(() => {
    const fetchPermission = async () => {
      const response = await authentication.getPermission();
      handle('permissionUsers', response?.data);
    };
    const getDealer = async () => {
      const response = await authentication.getCurrentDealer();
      handle('account_dealer', response?.data);
    };
    getDealer();
    fetchPermission();
  }, []);
};

// Custom hook to check if a user has a specific permission
export const useHasPermission = (permission_name: string) => {
  const permissionUser = createStore((state) => state.permissionUsers);
  return permissionUser.some((user: any) =>
    user.permissions.some(
      (permission: any) => permission.name === permission_name,
    ),
  );
};
