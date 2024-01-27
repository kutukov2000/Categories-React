import { Modal } from "antd";

type Props = {
    open: boolean;
    title: string;
    image: string;
    onCancel: () => void;
}

function ImagePreviewModal({ open, title, image, onCancel }: Props) {

    return (
        <Modal open={open} title={title} footer={null} onCancel={onCancel}>
            <img alt="Category or product image" style={{ width: '100%' }} src={image} />
        </Modal>
    );
}

export default ImagePreviewModal;