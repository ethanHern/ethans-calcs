import { CreateBlockMatrix, CreateIdentity, GetMatrixColumns, GetMatrixRows, MatrixMethods, SwapRows, type Matrix, } from "./matrix";
import { type Vector, VectorMethods } from "./vector";

export type MatrixData = {
    name: string,
    size?: {
        rows: number,
        cols: number
    },
    matrix: Matrix
}

export type MatrixOutputData = {
    result: MatrixData[],
    show_result_name?: boolean,
    failed?: {
        failure_message: string
    },
    steps?: MatrixData[]

}

const mMethods = new MatrixMethods();
const vMethods = new VectorMethods();

/**
 * Takes in two matrices and performs standard matrix multiplication.
 * The number of columns in A must match the number of rows in B.
 * Returns the resulting matrix
 * @param A The matrix on the left of the multiplication
 * @param B The matrix on the right of the multiplication
 * @returns The resulting matrix with the same number of columns as B has, and the same number of rows as A has.
 */
export function MultiplyMatrices(A: Matrix, B: Matrix): MatrixOutputData {
    if (GetMatrixColumns(A) != GetMatrixRows(B)) {
        return {
            result: [],
            failed: {
                failure_message: "The number of columns in A must match the number of rows in B!"
            }
        }
    }

    let c: Matrix = Array(GetMatrixRows(A)).fill(null).map(() => Array(GetMatrixColumns(B)).fill(0));
    for (let i = 0; i < GetMatrixRows(A); i++) {
        for (let j = 0; j < GetMatrixColumns(B); j++) {
            let temp = 0;
            for (let k = 0; k < GetMatrixColumns(A); k++) {
                temp+= A[i][k] * B[k][j];
            }
            c[i][j] = temp;
        }
    }
    return {
        result: [{name: "Result", size: {rows: GetMatrixRows(c), cols: GetMatrixColumns(c)}, matrix: c}]
    };
}

export function AddMatrices(A: Matrix, B: Matrix): MatrixOutputData {
    if ((GetMatrixColumns(A) != GetMatrixColumns(B)) || (GetMatrixRows(A) != GetMatrixRows(B))) {
        return {
            result: [],
            failed: {failure_message: "The dimensions of A must match the dimensions of B!"}
        };
    } // If the dimensions do not match
    const rows = GetMatrixRows(A);
    const cols = GetMatrixColumns(A);
    let c: Matrix = Array(rows).fill(null).map(()=> Array(cols).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            c[i][j] = A[i][j] + B[i][j];
        }
    }
    return {result: [{name: "Result", size: {rows: rows, cols: cols}, matrix: c}]};
}

export function SubtractMatrices(A: Matrix, B: Matrix): MatrixOutputData {
    if ((GetMatrixColumns(A) != GetMatrixColumns(B)) || (GetMatrixRows(A) != GetMatrixRows(B))) {
        return {
            result: [],
            failed: {failure_message: "The dimensions of A must match the dimensions of B!"}
        };
    } // If the dimensions do not match
    const rows = GetMatrixRows(A);
    const cols = GetMatrixColumns(A);
    let c: Matrix = Array(rows).fill(null).map(()=> Array(cols).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            c[i][j] = A[i][j] - B[i][j];
        }
    }
    return {result: [{name: "Result", size: {rows: rows, cols: cols}, matrix: c}]};
}


/**
 * Takes in a matrix and performs Gaussian elimination, resulting in the matrix in Reduced Echelon Form (REF)
 * 
 * @param matrix The matrix which Gaussian elimination will be performed on
 * 
 * @returns A clone of the provided matrix in REF
 */
export function GaussianElimination(matrix: Matrix): MatrixOutputData {
    let result = matrix.map(row => [...row]); // This is done so React will trigger a re-render because this is technically a new variable.
    let elimination_steps: MatrixData[] = [];
    const columns = GetMatrixColumns(result);
    const rows = GetMatrixRows(result);
    
    let noZeroPivots = true;
    for (let pivot = 0; pivot < columns && pivot < rows; pivot++) { // n = current pivot number
        if (result[pivot][pivot] == 0) { // If a zero pivot is encountered
            noZeroPivots = false;
            for (let i = pivot + 1; i < rows; i++) { // Search the rows below the current pivot to find a suitable swap
                if (result[i][pivot] != 0) {
                    result = SwapRows(result, pivot, i) as Matrix; // Swaps the row containing the nth pivot with the ith row
                    noZeroPivots = true;
                    break;
                }
            }
        }
        // If the zero pivot cannot be resolved, elimination fails
        if (noZeroPivots != true) {
            return {
                result: [{
                    name: "",
                    size: {rows: rows, cols: columns},
                    matrix: result
                }],
                failed: {
                    failure_message: "Gaussian Elimination failed!"
                },
                steps: elimination_steps
            };
        }
        // Multiplier = entry to eliminate in row i / pivot in row n
        // Creates an identity matrix with size = # of rows in our matrix (will be used as an elimination matrix)
        let elimination_matrix = CreateIdentity(rows);
        for (let i = pivot + 1; i < rows; i++) { // Gather all multipliers below the pivot to place in elimination matrix
            //In the pivot-th elimination matrix, place the multiplier in the [i, pivot] spot
            elimination_matrix[i][pivot] = -(result[i][pivot] / result[pivot][pivot]);
        }
        result = MultiplyMatrices(elimination_matrix, result).result[0].matrix; // Multiply our current matrix by the elimination matrix
        elimination_steps.push({name: `Gaussian Elimination Step ${pivot+1}`, size: {rows: rows, cols: columns}, matrix: result.map(row => [...row])});
    }
    elimination_steps.push({name: "Result", size: {rows: rows, cols: columns}, matrix: result})
    return {result: [{name: "Result", size: {rows: rows, cols: columns}, matrix: result}], steps: elimination_steps};
}

export function GaussJordanElimination(matrix: Matrix): MatrixOutputData {
    // Step 1, perform Gaussian Elimination
    let gaussian = GaussianElimination(matrix);
    if (gaussian.failed) { // If Gaussian elimination failed, return the matrix up to the point of failure
        return gaussian;
    }
    let ref_form = gaussian.result[0].matrix;

    let normalized_form = ref_form.map(row => [...row]);
    const normalRows = GetMatrixRows(normalized_form);
    const normalCols = GetMatrixColumns(normalized_form);
    const numberOfPivots = Math.min(normalRows, normalCols);
    // TODO: Step 2: Normalize the matrix (divide each row by its pivot)
    for (let i = 0; i < numberOfPivots; i++) { // For each pivot [i][i],
        let pivot = normalized_form[i][i];
        for (let j = i; j < normalCols; j++) { // For each element to the right of the pivot [i][j] (including the pivot),
            normalized_form[i][j] = normalized_form[i][j] / pivot; // Divide each cell by the pivot to normalize (1's on the diagonal)
        }
    }
    // Step 3: Backwards elimination
    let result = normalized_form.map(row => [...row]);
    let multiplier = 0;
    // This will be the number of pivots
    // For every row with a pivot, starting at the last pivot working backwards
    for (let i = numberOfPivots-1; i > 0 ; i--) {
        // For every row above the current pivot, iterating upwards
        for (let j = i-1; j >= 0; j--) {
            // Since the pivot is 1 because normalization, the multiplier is just the element above the current pivot in the current row
            multiplier = result[j][i];
            // Starting at the cell above the current pivot on the current row. Any cells to the left will be added with 0
            // (because upper triangular), so they can be skipped
            for (let k = i; k < normalCols; k++) {
                result[j][k] -= (multiplier * result[i][k]);
            }
        }
    }
    return {
        result: [{name: "Result", size: {rows: normalRows, cols: normalCols}, matrix: result}],
        steps: [
            {name: "REF Form", size: {rows: normalRows, cols: normalCols},matrix: ref_form},
            {name: "Normalized Form", size: {rows: normalRows, cols: normalCols},matrix: normalized_form},
            {name: "Result", size: {rows: normalRows, cols: normalCols},matrix: result}
        ]
    }
}

export function InvertMatrix(matrix: Matrix): MatrixOutputData {
    // Step 1: Create a block matrix with the input matrix and an Identity Matrix [M I]
    let block = CreateBlockMatrix(matrix, CreateIdentity(GetMatrixRows(matrix)));

    // Step 2: Perform Gauss-Jordan Elimination on the block matrix
    let elimination = GaussJordanElimination(block);

    // Now, the eliminated matrix should be a block matrix with the identity on the left and the inverted matrix on the right
    // Step 3: Extract inverted matrix
    if (elimination.failed) { // Elimination failed
        elimination.failed.failure_message = "Matrix Inversion failed!" + elimination.failed.failure_message;
        return elimination;
    }
    let GJ_Form = elimination.result[0].matrix;
    const size = GetMatrixRows(GJ_Form); // Because we're dealing with square matrices, the number of columns in the inverted matrix is equal to the number of rows in the block matrix
    let inverted: Matrix = Array(size).fill(null).map(()=> Array(size).fill(0));
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            inverted[i][j] = GJ_Form[i][j + size];
        }
    }
    return {
        result: [{name: "Result", size: {rows: size, cols: size}, matrix: inverted}],
        steps: [
            {name: "Step 1: Create block matrix with A and Identity matrix", size: {rows: size, cols: GetMatrixColumns(block)}, matrix: block},
            {name: "Step 2: Perform Gauss-Jordan Elimination on block matrix", size: {rows: size, cols: GetMatrixColumns(block)}, matrix:GJ_Form},
            {name: "Step 3: Extract inverted matrix from right side of block matrix", size: {rows: size, cols: size}, matrix: inverted}
        ]
    };
}

export function GramSchmidt(matrix: Matrix): MatrixOutputData {
    const a = mMethods.matrix_to_vectors(matrix);
    const shape = {rows: GetMatrixRows(matrix), cols: GetMatrixColumns(matrix)};
    let v: Vector[] = mMethods.matrix_to_vectors(Array(shape.rows).fill(null).map(()=> Array(shape.cols).fill(0)) as Matrix);
    let Q: Vector[] = mMethods.matrix_to_vectors(Array(shape.rows).fill(null).map(()=> Array(shape.cols).fill(0)) as Matrix);
    v[0] = a[0];
    for (let i = 1; i < shape.cols; i++) {
        Q[i-1] = vMethods.normalize(v[i-1]);
        v[i] = a[i];
        for (let j = 0; j < i; j++) { // v[i] -= (Q[j] * Q[j].T) * A[i]
            v[i] = vMethods.subtract(
                v[i],
                mMethods.matrix_to_vectors(MultiplyMatrices(
                    MultiplyMatrices(vMethods.to_matrix(Q[j]), vMethods.transpose(Q[j])).result[0].matrix,
                    vMethods.to_matrix(a[i])
                    ).result[0].matrix
                )[0]
            )
        }
    }
    Q[shape.cols - 1] = vMethods.normalize(v[shape.cols-1]);
    const QMatrix = vMethods.vectors_to_matrix(Q);
    let R = MultiplyMatrices(mMethods.transpose(QMatrix), matrix).result[0].matrix;

    return {
        result: [
            { name: "Q", size: {rows: GetMatrixRows(QMatrix), cols: GetMatrixColumns(QMatrix)}, matrix: QMatrix},
            { name: "R", size: {rows: GetMatrixRows(R), cols: GetMatrixColumns(R)}, matrix: mMethods.filter_tiny_numbers(R)}
        ],
        show_result_name: true
    }
}