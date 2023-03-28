import {
  QrReader as _QrReader,
  QrReaderProps as _QrReaderProps,
} from "react-qr-reader";

type QrReaderProps = Omit<_QrReaderProps, "constraints">;

const QrReader = ({ onResult, ...props }: QrReaderProps) => {
  return (
    <_QrReader
      {...props}
      onResult={onResult}
      constraints={{
        facingMode: "environment",
      }}
      videoStyle={{
        height: "auto",
        width: "100%",
        borderRadius: "0.25rem",
      }}
    />
  );
};

export default QrReader;
