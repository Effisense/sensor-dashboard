import {
  QrReader as _QrReader,
  QrReaderProps as _QrReaderProps,
} from "react-qr-reader";

interface QrReaderProps extends Omit<_QrReaderProps, "constraints"> {
  data: string | null;
  setData: (data: string) => void;
}

const QrReader = ({ data, setData, ...props }: QrReaderProps) => {
  return (
    <_QrReader
      {...props}
      onResult={(result, error) => {
        if (!!result) {
          setData(result?.getText());
        }

        if (!!error) {
          console.info(error);
        }
      }}
      constraints={{
        facingMode: "environment",
      }}
    />
  );
};

export default QrReader;
