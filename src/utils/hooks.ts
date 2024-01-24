import { message } from "antd";
import { RcFile } from "antd/es/upload";

export const useCheckImageFile = (file: RcFile) => {
    const isImage = /^image\/\w+/.test(file.type);
    if (!isImage) {
        message.error('Choose image file!');
    }

    const isSmallerThat10Mb = file.size / 1024 / 1024 < 10;
    if (!isSmallerThat10Mb) {
        message.error('File size should not exceed 10MB!');
    }

    return isImage && isSmallerThat10Mb;
};