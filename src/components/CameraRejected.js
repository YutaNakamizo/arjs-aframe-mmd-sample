import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

const CameraRejected = ({
  ...props
}) => {
  return (
    <Dialog
      {...props}
    >
      <DialogTitle
      >
        カメラへのアクセスが拒否されました
      </DialogTitle>

      <DialogContent
      >
        <DialogContentText
        >
          AR 機能を利用するにはカメラが必要です.
        </DialogContentText>
        <DialogContentText
        >
          Web ブラウザの設定でカメラへのアクセスを許可してください.
        </DialogContentText>
      </DialogContent>

      <DialogActions
      >
        <Button
          variant="text"
          onClick={e => {
            window.location.reload();
          }}
        >
          Web ブラウザの設定を反映
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export {
  CameraRejected,
};

