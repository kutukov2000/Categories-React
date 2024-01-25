import { message } from "antd";
import { RcFile, UploadFile } from "antd/es/upload";
import { useState } from "react";

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

export const useImagePreview = () => {
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [previewTitle, setPreviewTitle] = useState<string>('');

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        console.log('preview image', file);
        if (!file.url && !file.preview) {
            file.preview = URL.createObjectURL(file.originFileObj as RcFile);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    return { previewOpen, previewImage, previewTitle, handleCancel, handlePreview };
};