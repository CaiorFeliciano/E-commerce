import { getProducts } from "@/lib/api";
import Image from "next/image";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Produtos</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">Nenhum produto cadastrado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 flex flex-col gap-2"
            >
              <div className="bg-gray-100 h-40 rounded flex items-center justify-center text-gray-400">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover rounded"
                  />
                ) : (
                  <span>Sem imagem</span>
                )}
              </div>
              <h2 className="font-medium">{product.name}</h2>
              <p className="text-sm text-gray-500 line-clamp-2">
                {product.description}
              </p>
              <p className="font-semibold text-lg">
                R$ {product.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
