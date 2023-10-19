import FSService from "./FS/FS-service";

const fsServiceInstance = new FSService()

fsServiceInstance.init().then(()=>{
    fsServiceInstance.start()
})
