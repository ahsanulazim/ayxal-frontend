const CjProductCardSkeleton = () => {
  return (
        <div className="card bg-base-100">
          <div>
           
          </div>
          <div className="card-body p-2">
            <h2 className="card-title text-base line-clamp-2">{product.nameEn}</h2>
            <p>
              {product.nowPrice ? (
                <>
                  <span className="font-bold text-main">${product.nowPrice}</span>{" "}
                  <span className="line-through text-xs opacity-50">
                    ${product.sellPrice}
                  </span>{" "}
                </>
              ) : (
                <span className="font-bold text-main">${product.sellPrice}</span>
              )}
            </p>
            <div className="flex justify-between gap-5 items-center">
              <p>
                Lists: <span className="font-bold">{product.listedNum}</span>
              </p>
              <div className="badge badge-accent">
                <LuWarehouse />
                {product.warehouseInventoryNum}
              </div>
            </div>
    
            <div className="card-actions">
              <button
                className={`btn ${isPending ? "" : "btn-main"} w-full`}
                onClick={() => mutate(productId)}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner"></span> Adding...
                  </>
                ) : (
                  <>
                    <LuPlus /> Add to Store
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
  )
}

export default CjProductCardSkeleton