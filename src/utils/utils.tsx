export const JsonToBuffer = (data:any)=>{
    const jsonString = JSON.stringify(data);
    const buffer = Buffer.from(jsonString, 'utf-8');
    return buffer



}