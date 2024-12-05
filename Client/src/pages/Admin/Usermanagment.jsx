import { useFetchData } from "6pp";
import { Avatar, Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { server } from '../../components/constants/config';
import AdminLayout from '../../components/Layout/AdminLayout';
import Table from "../../components/Shared/Table";
import { useErrors } from "../../hooks/hooks";
import { transformImage } from "../../libs/features";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },

  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200,
  },
];
const Usermanagment = () => {
  const [rows,setRows]=useState([]);

  const {loading,data,error}=useFetchData(`${server}/api/v1/admin/users`,"dashboard-users")
  useErrors([{
    error:error,
    isError:error
  }])

  const users=data?.AllUsers || [];
  useEffect(()=>{
    setRows(users.map((i)=> ({...i,id:i._id,avatar:transformImage(i.avatar,50)})))
  },[data])
  return (
    <AdminLayout>
      {
        loading ? <Skeleton height={"100vh"}/>:
        <Table heading={"All Users"} rows={rows} columns={columns}/>
        
      }
    </AdminLayout>
  )
}

export default Usermanagment