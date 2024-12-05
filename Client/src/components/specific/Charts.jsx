import React from 'react'
import {Line ,Doughnut} from "react-chartjs-2"

import {ArcElement, CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, plugins, PointElement, scales, Tooltip} from "chart.js";
import { Blue, lightblue, purple, purplelight } from '../constants/color';
import { getLast7Days } from '../../libs/features';
import zIndex from '@mui/material/styles/zIndex';
ChartJS.register(
    Tooltip,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    ArcElement,
    Filler,
    Legend
)

const lineOptions={
    responsive:true,
    plugins:{
        legend:{
            display: false
        },
        title:{
            display:false
        },
    },
    scales:{
        x:{
            grid:{
                display:false
            }
            
        },
        y:{
            grid:{
                display:false
            },
            beginAtZero:true
            
        },
    },
}
const labels=getLast7Days();
const LineChart = ({value=[]}) => {
    const data = {
        labels,
        datasets: [
            {
                data: value, // Added more data points
                label: "Messages",
                fill: true,
                backgroundColor: purplelight,
                borderColor: purple
            },
            
        ]
    };
    
  return (
    <Line data={data} options={lineOptions}/>
  )
}

const DoughnutOptions={
    responsive:true,
    plugins:{
        legend:{
            display: false
        }
    },
    cutout:120
}

const DoughnutChart=({value=[],labels=[]})=>{
    const data = {
        labels,
        datasets: [
            {
                data: value, // Added more data points
                label: "TotalChats vs Group Chats",
                backgroundColor: [purplelight,lightblue],
                hoverBackgroundColor: [purple,Blue],
                borderColor:[purple,Blue],
                offset:15
            },
            
        ]
    };
    return (
        <Doughnut style={{zIndex: 10}} data={data} options={DoughnutOptions}/>
    )
}

export {LineChart, DoughnutChart};