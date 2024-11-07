export const capitalize = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatDate = (dateString: string) => {

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();

    const formattedDate = `${day}.${month}.${year}`;

    return formattedDate;
};