/*
    Process works something like this:
    Take string as input
    Remove whitespaces
    Tokenize (make each character a token)
    Make a tree of those tokens

*/


export function CleanExpression(input: string): string {
    let result = input.replaceAll(' ', '');

    return result;
}