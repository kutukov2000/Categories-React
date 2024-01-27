import { Button, Form, FormInstance, Input, Upload } from "antd";
import { useCheckImageFile, useImagePreview } from "../../utils/hooks";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import { PlusOutlined } from "@ant-design/icons";
import ImagePreviewModal from "../ImagePreviewModal";

type Props = {
    submitButtonTitle: "Create" | "Edit";
    form?: FormInstance;
    onFinish: (values: any) => Promise<void>;
    onChange: (info: UploadChangeParam<UploadFile<any>>) => void;
    fileList: UploadFile[];
}

type FieldType = {
    category_id?: string;
    name?: string;
    description?: string;
    price?: string;
    quantity?: string;
};

function ProductForm({ form, submitButtonTitle, onFinish, onChange, fileList }: Props) {
    const { previewOpen, previewImage, previewTitle, handleCancel, handlePreview } = useImagePreview();

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const checkImageFile = (file: RcFile) => useCheckImageFile(file);

    return (
        <Form
            form={form}
            style={{ maxWidth: 1000 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off" >
            <Form.Item<FieldType>
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Product name is required!' }]} >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Product description is required!' }]} >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Price"
                name="price"
                rules={[{ required: true, message: 'Product price is required!' }]} >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: 'Product quantity is required!' }]} >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Category Id"
                name="category_id"
                rules={[{ required: true, message: 'Category Id is required!' }]} >
                <Input />
            </Form.Item>

            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={true}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                beforeUpload={checkImageFile}
                onChange={onChange}
                onPreview={handlePreview}
                fileList={fileList}
                accept={"image/*"}>
                <PlusOutlined />
            </Upload>

            <ImagePreviewModal open={previewOpen}
                title={previewTitle}
                image={previewImage}
                onCancel={handleCancel} />

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    {submitButtonTitle}
                </Button>
            </Form.Item>
        </Form>
    );
}

export default ProductForm;