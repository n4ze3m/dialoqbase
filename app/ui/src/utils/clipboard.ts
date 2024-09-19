export const clipbardCopy = async (value: string) => {
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = value;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
    }
}