import { X } from "lucide-react";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
// import { removeFromCart, clearCart } from "@/redux/slices/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { clearCart, removeFromCart } from "@/redux/slice/CartSlice";
import { formatCurrency } from "@/lib/formatCurrency";

const CartModal = ({ openCart, setOpenCart }) => {
  const dispatch = useDispatch();
  const { items, totalPrice, totalQuantity } = useSelector(
    (state) => state.cart
  );

  return (
    <div>
      {/* Overlay */}
      {openCart && (
        <div
          onClick={() => setOpenCart(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Drawer */}
          <div
          className={`fixed top-0 right-0 h-full w-[400px] bg-white text-black shadow-xl z-50 transform transition-transform duration-300
          ${openCart ? "translate-x-0" : "translate-x-full"}`}
        >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b text-black">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button onClick={() => setOpenCart(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="p-4 h-[calc(100%-150px)] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">🛒 Cart is empty</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variant?._id || "base"}`}
                  className="flex gap-3 items-center border-b pb-3"
                >
                  {/* Product image */}
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    {item.variant && (
                      <p className="text-xs text-gray-500">
                        {item.variant.attributes.color} -{" "}
                        {item.variant.attributes.size}
                      </p>
                    )}
                    <p className="text-sm text-gray-700">
                      {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          productId: item.productId,
                          variantId: item.variant?._id,
                        })
                      )
                    }
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
            <div className="flex justify-between mb-3">
              <span className="font-medium">Total ({totalQuantity} items):</span>
              <span className="font-semibold">{formatCurrency(totalPrice.toFixed(2))}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(clearCart())}
                className="w-1/3 px-3 py-2 rounded-md border hover:bg-gray-100"
              >
                Clear
              </button>
              <Link
                href="/checkout"
                className="w-2/3 text-center bg-black text-white px-3 py-2 rounded-md hover:bg-gray-800"
                onClick={() => setOpenCart(false)}
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
