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

// /dpr_auto/w_200
export const transformImage = (url = "", width = 100) => {
    url=url.toString();
    const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
  
    return newUrl;
  };
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

export const getOrSaveFromStorage=({key,value,get})=>{
    
    if (get)
        return localStorage.getItem(key)
          ? JSON.parse(localStorage.getItem(key))
          : null;
      else localStorage.setItem(key, JSON.stringify(value));
}
