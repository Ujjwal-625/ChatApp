import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const useErrors= (errors=[])=>{
  // console.log("inside useError" ,errors);
    useEffect(()=>{
    errors.forEach(({isError,error,fallback})=>{
        
            if(isError){
                if(fallback){
                    fallback();
                }
                else {
                    console.log(error)
                    toast.error(error?.data?.errorMessage ||error?.data?.message || "something went wrong");
                }
            }
    })
},[errors])
}

const useAsyncMutation = (mutatationHook) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
  
    const [mutate] = mutatationHook();
  
    const executeMutation = async (toastMessage, ...args) => {
      setIsLoading(true);
      const toastId = toast.loading(toastMessage || "Updating data...");
  
      try {
        const res = await mutate(...args);
  
        if (res.data) {
          toast.success(res.data.message || "Updated data successfully", {
            id: toastId,
          });
          setData(res.data);
        } else {
          //console.log(res);
          toast.error(res?.error?.data?.errorMessage||res?.error?.data?.message || "Something went wrong", {
            id: toastId,
          });
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong", { id: toastId });
      } finally {
        setIsLoading(false);
      }
    };
  
    return [executeMutation, isLoading, data];
  };

  const useSocketEvents = (socket, handlers) => {
    useEffect(() => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.on(event, handler);
      });
  
      return () => {
        Object.entries(handlers).forEach(([event, handler]) => {
          socket.off(event, handler);
        });
      };
    }, [socket, handlers]);
  };

export {useErrors,useAsyncMutation,useSocketEvents}