import { Divider, message, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { ICategoryCreate } from "./types.ts";
import http_common from "../../../http_common.ts";
import CategoryForm from "../CategoryForm.tsx";



const customDividerStyle = {
    borderTop: '2px solid #1890ff',
    margin: '5px 0 50px 0',
};

const CategoryCreatePage = () => {

    const navigate = useNavigate();

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const onFinish = async (values: any) => {
        console.log('Success:', values);

        if (fileList == null) {
            setErrorMessage("Choose image!");
            return;
        }

        const fileListAsFile = fileList.map(file => file.originFileObj ? file.originFileObj : file.url) as File[];

        const model: ICategoryCreate = {
            name: values.name,
            image: fileListAsFile[0]
        };

        try {
            await http_common.post("/api/categories", model, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            //Return to home page
            navigate("/");
        }
        catch (ex) {
            message.error('Category creating error!');
        }
    }

    const handleImageFileListChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    return (
        <>
            <Divider style={customDividerStyle}>Create category</Divider>
            {errorMessage && <Alert message={errorMessage} style={{ marginBottom: "20px" }} type="error" />}
            <CategoryForm submitButtonTitle="Create"
                onFinish={onFinish}
                onChange={handleImageFileListChange}
                fileList={fileList} />
        </>
    );
}

export default CategoryCreatePage;