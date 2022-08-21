interface Props {
  number: string;
  url: string;
}

const WhatsappButton: React.FC<Props> = ({ number, url }) => {
  return (
    <a
      className="btn btn-success"
      href={`https://wa.me/${number}?text=Olá estou interessado neste quarto! ${url}.`}
      target="_blank"
      rel="noreferrer noopener nofollow"
    >
      Contato direto por Whatsapp
    </a>
  );
};

export default WhatsappButton;
