import { useEffect, useState } from "react";
import { Divider, message, Alert } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { ICategoryEdit } from "./types.ts";
import { APP_ENV } from "../../../env/index.ts";
import http_common from "../../../http_common.ts";
import CategoryForm from "../CategoryForm.tsx";
import { useForm } from "antd/es/form/Form";

const customDividerStyle = {
    borderTop: '2px solid #1890ff',
    margin: '5px 0 50px 0',
};

const CategoriesEditPage = () => {
    const { id } = useParams();

    const navigate = useNavigate();
    const urlServerImage = APP_ENV.BASE_URL + "/upload/150_";

    const [form] = useForm();

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        http_common.get(`/api/categories/${id}`)
            .then(response => {
                console.log(response.data);
                form.setFieldsValue({ name: response.data?.name });

                setFileList([
                    {
                        uid: response.data?.id,
                        name: response.data?.image,
                        status: 'done',
                        url: urlServerImage + response.data?.image
                    }
                ]);
            });
    }, [id]);

    const onFinish = async (values: any) => {
        console.log('Success:', values);

        if (fileList == null) {
            setErrorMessage("Choose image!");
            return;
        }

        const fileListAsFile = fileList.map(file => file.originFileObj ? file.originFileObj : file.url) as File[];

        const model: ICategoryEdit = {
            name: values.name,
            image: fileListAsFile[0]
        };

        try {
            await http_common.post(`/api/categories/edit/${id}`, model, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            // Return to home page or handle success as needed
            navigate("/");
        } catch (ex) {
            message.error('Category editing error!');
        }
    };

    const handleImageFileListChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    return (
        <>
            <Divider style={customDividerStyle}>Edit category</Divider>
            {errorMessage && <Alert message={errorMessage} style={{ marginBottom: "20px" }} type="error" />}
            <CategoryForm form={form}
                submitButtonTitle="Edit"
                onFinish={onFinish}
                onChange={handleImageFileListChange}
                fileList={fileList} />
        </>
    );
}

export default CategoriesEditPage;


