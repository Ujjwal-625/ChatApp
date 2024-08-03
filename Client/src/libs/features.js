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
