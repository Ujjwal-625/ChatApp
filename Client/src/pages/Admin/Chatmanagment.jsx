import { Avatar, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import AvatarCard from "../../components/Shared/AvtarCard";
import Table from "../../components/Shared/Table";
import { dashboardData } from '../../components/constants/sampleData';
import { transformImage } from "../../libs/features";
import { useFetchData } from '6pp';
import { server } from '../../components/constants/config';
import { useErrors } from '../../hooks/hooks';

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
    renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
  },

  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },

  {
    field: "groupChat",
    headerName: "Group",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <AvatarCard max={100} avatar={params.row.members} />
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={"1rem"}>
        <Avatar alt={params.row.creator.name} src={params.row.creator.avatar} />
        <span>{params.row.creator.name}</span>
      </Stack>
    ),
  },
];


const Chatmanagment = () => {
  const [rows,setRows]=useState([]);

  const {loading,data,error}=useFetchData(`${server}/api/v1/admin/chats`,"dashboard-chats")
  useErrors([{
    error:error,
    isError:error
  }])
  console.log(data);

  useEffect(()=>{
    if(data){
    setRows(
      data.Chats.map((i) => ({
        ...i,
        id: i._id,
        avatar: i.avatar.map((i) => transformImage(i, 50)),
        members: i.members.map((i) => transformImage(i.avatar, 50)),
        creator: {
          name: i.creater.name,
          avatar: transformImage(i.creater.avatar, 50),
        },
      }))
  );
}
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

export default Chatmanagment