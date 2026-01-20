import useConfirmStore from '../states/useConfirmStore';

export const useConfirm = () => {
  const ask = useConfirmStore((state) => state.ask);
  return ask;
};