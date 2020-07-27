export const sortData = (data)=>{
    const soertedData = [...data];

    soertedData.sort((a,b) => {
        if(a.cases > b.cases){
            return -1;

        }else{
            return 1;
        }
    })

    return soertedData;
}