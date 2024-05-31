export const JsonToBuffer = (data:any)=>{
    const jsonString = JSON.stringify(data);
    const buffer = Buffer.from(jsonString, 'utf-8');
    return buffer



}


export const base64ToURL = async(base64:any, contentType = '')=> {
    // Create a data URL from the base64 string
    const base64Url = `data:${contentType};base64,${base64}`;
  
    // Use the fetch API to fetch the data URL
    const data = await fetch(base64Url)
    const blob = await data.blob()
    const url = URL.createObjectURL(blob)
    return url
  }
  
  export const  getFileExtension=(filename:string) =>{
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex + 1) : '';
  }