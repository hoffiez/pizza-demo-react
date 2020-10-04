
export const truncateString = (string: string, length: number, postfix: string = '...') => {
    return string.length > length ? string.substring(0, length) + postfix : string;
};