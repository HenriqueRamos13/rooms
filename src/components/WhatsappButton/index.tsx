interface Props {
  number: string;
  url: string;
  disabled?: boolean;
}

const WhatsappButton: React.FC<Props> = ({ number, url, disabled }) => {
  return (
    <a
      href={`https://wa.me/${number}?text=Olá estou interessado neste quarto! ${url}`}
      target="_blank"
      rel="noreferrer noopener nofollow"
    >
      <button disabled={disabled} className="btn btn-success text-white">
        Contato direto por Whatsapp
      </button>
    </a>
  );
};

export default WhatsappButton;
