import axios from 'axios';
import FormData from 'form-data';
import { File } from '../middlewares/upload.middleware';
import { AuthService } from './auth.service';

class UploadService {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }
  async formData(file: File) {
    const { originalname, buffer, mimetype, size } = file;
    const formData = new FormData();
    formData.append('file', buffer, { filename: originalname });
    formData.append(
      'metadata',
      JSON.stringify({ originalname, mimetype, size })
    );
    return formData;
  }

  private uploadFileToServer = async (formData: any, uploadToken: string) => {
    try {
      const response = await axios.post(
        `${process.env.UPLOAD_SERVICE_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
            Authorization: `Bearer ${uploadToken}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        error.status = error.response.status;
        error.message = error.response.data.message;
        const err = new Error(`Upload file to server: ${error.message}`);
        (err as any).status = error.status;
        throw err;
      }
      throw error;
    }
  };

  async uploadFile(file: File) {
    const formData = await this.formData(file);
    const uploadToken = await this.authService.generateUploadToken();
    const response = await this.uploadFileToServer(formData, uploadToken);
    return response;
  }

  async uploadEventImage(file: File) {
    const formData = await this.formData(file);
    const uploadToken = await this.authService.generateUploadToken();
    const response = await this.uploadEventImageToServer(formData, uploadToken);
    return response;
  }

  private uploadEventImageToServer = async (
    formData: any,
    uploadToken: string
  ) => {
    try {
      const response = await axios.post(
        `${process.env.UPLOAD_SERVICE_URL}/event/upload`,
        formData,
        {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
            Authorization: `Bearer ${uploadToken}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        error.status = error.response.status;
        error.message = error.response.data.message;
        const err = new Error(`Upload file to server: ${error.message}`);
        (err as any).status = error.status;
        throw err;
      }
      throw error;
    }
  };

  async viewFile(filename: string) {
    const uploadToken = await this.authService.generateUploadToken();
    const response = await this.viewFileFromServer(filename, uploadToken);
    return response;
  }

  async viewFileFromServer(filename: string, uploadToken: string) {
    const response = await axios.get(
      `${process.env.UPLOAD_SERVICE_URL}/image/${filename}`,
      {
        headers: {
          Authorization: `Bearer ${uploadToken}`
        },
        responseType: 'arraybuffer'
      }
    );
    console.log('response server:', response.data);
    return response;
  }

  async deleteFile(filename: string) {
    const uploadToken = await this.authService.generateUploadToken();
    const response = await this.deleteFileFromServer(filename, uploadToken);
    return response;
  }

  async deleteFileFromServer(filename: string, uploadToken: string) {
    const response = await axios.post(
      `${process.env.UPLOAD_SERVICE_URL}/delete/${filename}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${uploadToken}`
        }
      }
    );
    return response.data;
  }
}
export { UploadService };
