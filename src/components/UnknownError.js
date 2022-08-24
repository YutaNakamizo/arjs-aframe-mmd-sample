import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

const UnknownError = ({
  ...props
}) => {
  return (
    <Dialog
      {...props}
    >
      <DialogTitle
      >
        予期しないエラーが発生しました
      </DialogTitle>

      <DialogContent
      >
        <DialogContentText
        >
          予期しないエラーが発生しました.
        </DialogContentText>
        <DialogContentText
        >
          [再読み込み] を押して, ページを再読み込みしてください.
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
          再読み込み
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export {
  UnknownError,
};

