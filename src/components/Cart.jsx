import { useEffect } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Button from "./ui/Button";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export default function Cart({
  items,
  isOpen,
  onClose,
  onQuantityChange,
  onRemove,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div
      className="cart-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="cart-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <header className="cart-header">
          <h2 id="cart-title">Your Cart ({itemCount})</h2>
          <button
            type="button"
            className="cart-close"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={40} aria-hidden="true" />
            <h3>Your cart is empty</h3>
            <p>Add a coffee you love and it will show up here.</p>
            <Button variant="primary" size="sm" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.name}>
                  <img
                    className="cart-item-image"
                    src={item.image}
                    alt=""
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-title-row">
                      <h3>{item.name}</h3>
                      <button
                        type="button"
                        className="cart-remove"
                        onClick={() => onRemove(item.name)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                    <p>{formatPrice(item.price)} each</p>
                    <div className="cart-item-controls">
                      <div
                        className="cart-quantity"
                        aria-label={`Quantity: ${item.quantity}`}
                      >
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          onClick={() =>
                            onQuantityChange(item.name, item.quantity - 1)
                          }
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() =>
                            onQuantityChange(item.name, item.quantity + 1)
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <strong>{formatPrice(item.price * item.quantity)}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <footer className="cart-summary">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <Button variant="accent" size="md" className="w-full" disabled>
                Checkout Coming Soon
              </Button>
              <p>Shipping and taxes calculated at checkout.</p>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
