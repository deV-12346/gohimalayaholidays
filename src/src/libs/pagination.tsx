export const pagination = (page:number,rowPerPage:number)=>{
     const skip = (page-1) * rowPerPage
     return {limit:rowPerPage,offset:skip}
}