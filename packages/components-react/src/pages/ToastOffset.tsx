import { PToast, useToastManager } from '@porsche-design-system/components-react';
import { useEffect } from 'react';

export const ToastOffsetPage = (): JSX.Element => {
  const { addMessage } = useToastManager();

  const style = `
  .playground {
    height: 300px;
    padding: 0;
    transform: translateX(0);
    border: 1px solid deeppink;
  }

  p-toast {
    --p-toast-position-bottom: 200px;
  }`;

  useEffect(() => {
    addMessage({ text: `Some message` });
  }, [addMessage]);

  return (
    <>
      <style children={style} />
      <div
        className="playground light"
        title="should render toast neutral on light background with custom bottom position"
      >
        <PToast />
      </div>
    </>
  );
};
