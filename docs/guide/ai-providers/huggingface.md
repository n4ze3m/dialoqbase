# Hugging Face

Hugging Face is a company that provides a wide range of NLP services, including a large number of pre-trained models. The Hugging Face AI Provider allows you to use these models in your own applications.

Official Website: [https://huggingface.co/](https://huggingface.co/?ref=dialoqbase)


## Supported Models on Dialoqbase

| Model Name | Type |
| --- | --- |
| sentence-transformers/distilbert-base-nli-mean-tokens | Embedding |
| Xenova/bert-base-uncased | Embedding |


## API Key

For some models, you need to provide an API key. Here is the pricing page: [https://huggingface.co/pricing](https://huggingface.co/pricing).

If your account doesn't have enough credits, the API will return an error.

`Xenova/bert-base-uncased` model not requires an API key which use your `cpu` for embedding. 


## How to get API Key

1. Go to [https://huggingface.co/](https://huggingface.co/?ref=dialoqbase) and login with your Hugging Face account.

2. Navigate to the [https://huggingface.co/settings/token](https://huggingface.co/settings/token) page.

3. Copy your API key and paste it to the `HUGGING_FACE_API_KEY` environment variable.


## Disclaimer

Dialoqbase is not affiliated with Hugging Face. All product names, logos, and brands are property of their respective owners. All company, product and service names used in this website are for identification purposes only. Use of these names, logos, and brands does not imply endorsement.