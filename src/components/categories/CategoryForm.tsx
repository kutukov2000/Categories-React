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
    name?: string;
};

function CategoryForm({ form, submitButtonTitle, onFinish, onChange, fileList }: Props) {
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
                rules={[{ required: true, message: 'Category name is required!' }]} >
                <Input />
            </Form.Item>

            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={true}
                fileList={fileList}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                beforeUpload={checkImageFile}
                onChange={onChange}
                onPreview={handlePreview}
                accept={"image/*"} >
                {fileList?.length > 0 ? null : <PlusOutlined />}
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

export default CategoryForm;