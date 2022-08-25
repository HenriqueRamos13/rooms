interface Props {
  number: string;
  url: string;
  disabled?: boolean;
}

const WhatsappButton: React.FC<Props> = ({ number, url, disabled }) => {
  return (
    <button disabled={disabled} className="btn btn-success">
      <a
        className="text-white"
        href={`https://wa.me/${number}?text=Olá estou interessado neste quarto! ${url}.`}
        target="_blank"
        rel="noreferrer noopener nofollow"
      >
        Contato direto por Whatsapp
      </a>
    </button>
  );
};

export default WhatsappButton;
