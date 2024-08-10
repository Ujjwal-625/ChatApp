import moment from "moment";

export const fileFormat=(url="")=>{
        const extenstion=url.split(".").pop();

        if(extenstion=="mp4" || extenstion=="ogg" || extenstion=="webm")
            return "video";
        if(extenstion=="mp3" || extenstion=="wav")
            return "audio";
        if(extenstion=="jpg" || extenstion=="png" || extenstion=="jpeg" || extenstion=="gif")
            return "image";
        return "file";
}

export const transformImage=(url="" ,width=100)=>url

export const getLast7Days=()=>{
   const currentDate=moment();
   const last7day=[];
   for(let i=0;i<7;i++){
    const a=currentDate.clone().subtract(i,"days");
    const dayName=a.format('dddd');
    last7day.unshift(dayName);
   }
    return last7day;
}
