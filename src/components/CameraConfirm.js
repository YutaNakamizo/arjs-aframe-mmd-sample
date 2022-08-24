import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

const CameraConfirm = ({
  onClickOk = new Function(),
  ...props
}) => {
  return (
    <Dialog
      {...props}
    >
      <DialogTitle
      >
        カメラへのアクセスを許可してください
      </DialogTitle>

      <DialogContent
      >
        <DialogContentText
        >
          AR 機能を利用するにはカメラが必要です.
        </DialogContentText>
        <DialogContentText
        >
          [次へ] を押してからカメラへのアクセスを許可してください.
        </DialogContentText>
      </DialogContent>

      <DialogActions
      >
        <Button
          variant="text"
          onClick={onClickOk}
        >
          次へ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export {
  CameraConfirm,
};

