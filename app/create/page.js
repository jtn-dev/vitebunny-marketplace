'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaImage, FaPlus, FaTimes, FaWallet, FaEthereum } from 'react-icons/fa';
import Button from '../components/Button';
import { collections } from '../utils/dummyData';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { NFT_CONTRACT_ADDRESS, NFT_ABI } from '../utils/walletUtils';
import { toast } from 'react-hot-toast';

export default function Create() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    collection: '',
    price: '',
    royalty: '10',
    attributes: [{ trait_type: '', value: '' }]
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  
  // Contract write hook for minting NFT
  const { writeContractAsync, data: mintData, isPending, error } = useWriteContract();
  
  // Wait for transaction hook
  const { isLoading: isWaitingForTransaction, isSuccess: isTransactionSuccessful } = useWaitForTransactionReceipt({
    hash: mintData,
    onSuccess() {
      toast.success('NFT created successfully!');
      router.push('/');
    },
    onError() {
      toast.error('Failed to create NFT');
      setIsSubmitting(false);
    }
  });
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif')) {
      setIsUploading(true);
      
      // In a real app, you'd upload the file to IPFS or another storage solution
      // For now, we'll just create a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setUploadedImageUrl(reader.result); // In a real app, this would be the IPFS URL
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...formData.attributes];
    newAttributes[index][field] = value;
    setFormData({
      ...formData,
      attributes: newAttributes,
    });
  };
  
  const addAttribute = () => {
    setFormData({
      ...formData,
      attributes: [...formData.attributes, { trait_type: '', value: '' }],
    });
  };
  
  const removeAttribute = (index) => {
    const newAttributes = [...formData.attributes];
    newAttributes.splice(index, 1);
    setFormData({
      ...formData,
      attributes: newAttributes,
    });
  };
  
  const connectWallet = async () => {
    // In a real app, you would use a wallet provider like MetaMask
    // For this demo, we'll just simulate wallet connection
    setWalletConnected(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!previewImage) {
      toast.error('Please upload an image for your NFT');
      return;
    }
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you'd upload metadata to IPFS here
      // For this example, we'll create a simple metadata object
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: uploadedImageUrl,
        attributes: formData.attributes.filter(attr => attr.trait_type && attr.value)
      };
      
      // Convert metadata to a JSON string and encode as base64
      const jsonMetadata = JSON.stringify(metadata);
      const base64Metadata = `data:application/json;base64,${btoa(jsonMetadata)}`;
      
      // Call the mintNFT function on the smart contract
      await writeContractAsync({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'mintNFT',
        args: [
          address, // recipient
          base64Metadata, // tokenURI
          formData.collection || 'Default Collection' // collection
        ]
      });
      
    } catch (error) {
      console.error('Error creating NFT:', error);
      toast.error('Failed to create NFT: ' + error.message);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New NFT</h1>
        <p className="text-foreground/70 mt-2">Create your unique digital asset on the blockchain</p>
      </div>
      
      {!walletConnected && (
        <div className="bg-card-bg border border-border rounded-xl p-8 mb-8 text-center">
          <FaWallet className="mx-auto text-4xl mb-4 text-primary" />
          <h2 className="text-xl font-medium mb-2">Connect Your Wallet</h2>
          <p className="text-foreground/70 mb-6">Connect your wallet to start creating NFTs</p>
          <Button onClick={connectWallet} leftIcon={<FaWallet />}>
            Connect Wallet
          </Button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload */}
        <div className="bg-card-bg border border-border rounded-xl p-6">
          <label className="block text-sm font-medium mb-2">Upload File *</label>
          <p className="text-sm text-foreground/60 mb-4">
            Supported formats: JPG, PNG, GIF. Max size: 50MB.
          </p>
          
          <div 
            onClick={handleImageClick}
            className={`cursor-pointer border-2 border-dashed rounded-xl ${
              previewImage ? '' : 'border-border hover:border-primary'
            } flex flex-col items-center justify-center transition-colors h-64 relative overflow-hidden`}
          >
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
            />
            
            {previewImage ? (
              <div className="relative w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-2xl font-bold">NFT Preview</div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage(null);
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                >
                  <FaTimes />
                </button>
              </div>
            ) : isUploading ? (
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p>Uploading...</p>
              </div>
            ) : (
              <>
                <FaImage className="text-4xl text-foreground/40 mb-4" />
                <p className="text-center text-foreground/60">
                  Drag and drop your file here<br />or click to browse
                </p>
              </>
            )}
          </div>
        </div>
        
        {/* NFT Details */}
        <div className="bg-card-bg border border-border rounded-xl p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Name *</label>
              <input 
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Item name"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
              <textarea 
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Provide a detailed description of your item"
              />
            </div>
            
            <div>
              <label htmlFor="collection" className="block text-sm font-medium mb-2">Collection</label>
              <select 
                id="collection"
                name="collection"
                value={formData.collection}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select collection</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-2">Price *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEthereum className="text-foreground/40" />
                  </div>
                  <input 
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.001"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="royalty" className="block text-sm font-medium mb-2">Royalty %</label>
                <input 
                  type="number"
                  id="royalty"
                  name="royalty"
                  min="0"
                  max="15"
                  value={formData.royalty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="10"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Properties */}
        <div className="bg-card-bg border border-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Properties</h2>
            <button 
              type="button" 
              onClick={addAttribute}
              className="p-2 bg-primary/10 rounded-full text-primary hover:bg-primary/20"
            >
              <FaPlus />
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.attributes.map((attr, index) => (
              <div key={index} className="flex space-x-4">
                <div className="flex-1">
                  <input 
                    type="text"
                    value={attr.trait_type}
                    onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Property name"
                  />
                </div>
                <div className="flex-1">
                  <input 
                    type="text"
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Property value"
                  />
                </div>
                {formData.attributes.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeAttribute(index)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          type="submit" 
          size="lg" 
          isFullWidth 
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating NFT...' : 'Create NFT'}
        </Button>
      </form>
    </div>
  );
} 