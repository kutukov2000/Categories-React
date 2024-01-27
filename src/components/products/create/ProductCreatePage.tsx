import { Divider, message, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { IProductCreate } from "./types.ts";
import http_common from "../../../http_common.ts";
import ProductForm from "../ProductForm.tsx";

const customDividerStyle = {
    borderTop: '2px solid #1890ff',
    margin: '5px 0 50px 0',
};

const ProductCreatePage = () => {

    const navigate = useNavigate();

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        console.log('file:', fileList);

        if (fileList.length === 0) {
            setErrorMessage("Choose image!");
            return;
        }

        const model: IProductCreate = {
            category_id: values.category_id,
            name: values.name,
            description: values.description,
            price: values.price,
            quantity: values.quantity,
            images: fileList.map(file => file.originFileObj as File)
        };
        console.log(model);

        try {
            await http_common.post("/api/products", model, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            //Return to home page
            navigate("/products");
        }
        catch (ex) {
            message.error('Product creating error!');
        }
    }

    const handleImageFileListChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    return (
        <>
            <Divider style={customDividerStyle}>Create product</Divider>
            {errorMessage && <Alert message={errorMessage} style={{ marginBottom: "20px" }} type="error" />}
            <ProductForm
                submitButtonTitle="Create"
                onFinish={onFinish}
                onChange={handleImageFileListChange}
                fileList={fileList} />
        </>
    );
}

export default ProductCreatePage;