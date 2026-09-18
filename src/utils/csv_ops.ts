import { type SetStateAction } from "react";
import { StringToNum, VerifyMatrixForm, type Matrix, type StringMatrix } from "./matrix";

const default_matrix: StringMatrix = [['2', '2'], ['2', '2']];
export function ReadCSV(file: File, setMatrixFunction: (value: SetStateAction<Matrix>) => void) {
    
    const reader = new FileReader();
    reader.onload = () => {
        const text = reader.result;
        const rows = (text as string).split('\n').map((row) => row.split(','));
        if (rows[rows.length-1][0] == '') {rows.pop();}
        let matrix = StringToNum(rows);
        if (!VerifyMatrixForm(matrix)) {
            matrix = StringToNum(default_matrix);
        }

        setMatrixFunction(matrix);
    };
    reader.readAsText(file);
}

//const noDigits = /^[^0-9]+/;
//function CleanCSV(text: string[][]): StringMatrix {
//    let cleaned_text = text.slice(0, -1);
//    for (const row in cleaned_text){ // Remove spaces from CSV cells
//        row.replace(' ', '');
//    }
//    return cleaned_text;
//}