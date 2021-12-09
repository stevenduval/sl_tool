
//set reusable variables
const formatBtn =  document.querySelector('.format');
const tdSLPH = document.querySelector("#begin");

// removes anchors from the input and puts it in the output
formatBtn.addEventListener('click', () => {

    // run file export process when load event triggers
    const fileExport = () => {
        const data = document.querySelector('.input textarea').value;
        const workBook = readWorkBook(data);
        const workBookData = formatWorkBookData(workBook);
        const finalData = formatOutput(workBookData[0]);
        saveOutput(finalData);
    }

    // read the inbound data
    const readWorkBook = (workBook) => XLSX.read(workBook, { type: 'binary'});

    // format data to json object and telling which header fields to bring in
    const formatWorkBookData = (workBook) => workBook.SheetNames.map((sheetName) => {
            return XLSX.utils.sheet_to_json(workBook.Sheets[sheetName],{
            header:["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ", "BA", "BB"]
            }
        )
    });

    // format data for export
    const formatOutput = (data) => {
        // get the values from the data object
        const getKey = Object.values(data[0]);
        // get the keys from the data object
        const setKey = Object.keys(data[0]);
        // setting variables so we can grab them outside of the foreach below
        let billcode, colorado;
        let sl = [],
            ph = [];
        // loop through the object so we can find the fields containg the values we need and retreive the col they are in
        getKey.forEach((key, index) => {
            if (key.toLowerCase().includes('billcode')) {billcode = setKey[index]} ;
            if (key.toLowerCase().includes('job id')) {billcode = setKey[index]} ;
            if (key.toLowerCase().includes('wac') || key.toLowerCase().includes('colorado')) {colorado = setKey[index]};
            if (key.toLowerCase().includes('sl')) {sl.push(setKey[index])}; 
            if (key.toLowerCase().includes('ph')) {ph.push(setKey[index])};
        });
        // take header row out 
        data = data.slice(1);
        // set header for output
        const header = 'BILLCODE,MSG_NUM,COLORADO,SL_INITIAL,PH_INITIAL\n';
        // create a new array contaning the newly formatted data we want to export
        data = data.map(object => { 
            const billcodeFormat = `${object[billcode].replace('-','_')}`;
            const setColorado = (`${object[colorado]}` === `Y`)? `_CO` : ``;
            const setColoradoFlag = (`${object[colorado]}` === `Y`)? `Y` : ``;
            let datatoreturn = '';
            
            for ( i = 0; i < sl.length; i++) {
                datatoreturn += `"${billcodeFormat}","${i+1}${setColorado}","${setColoradoFlag}","${object[sl[i]]}","${object[ph[i]]}"\n`
            }
             return datatoreturn;   
        });
        //return the new array above and join the header to it
        return[
            header,
            ...data
            ].join('')
    }

    // save file to computer
    const saveOutput = (data) => { 
        const blob = new Blob([data], { type: "text/plain"});
        const anchor = document.createElement("a");
        const getDateTime = new Date().toLocaleString('en-gb').split(", ");
        const date = getDateTime[0].split("/").reverse().join("");
        const time = getDateTime[1].split(":").join("");
        anchor.download = `sl_map_tool_${date}${time}.csv`;
        anchor.href = window.URL.createObjectURL(blob);
        anchor.target ="_blank";
        anchor.style.display = "none"; // just to be safe!
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }
    fileExport();
});
            