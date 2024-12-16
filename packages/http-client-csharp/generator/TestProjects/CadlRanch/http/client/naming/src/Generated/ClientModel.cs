// <auto-generated/>

#nullable disable

using System.ClientModel;
using System.ClientModel.Primitives;
using System.Threading;
using System.Threading.Tasks;
using Client.Naming.Models;

namespace Client.Naming
{
    public partial class ClientModel
    {
        protected ClientModel() => throw null;

        public ClientPipeline Pipeline => throw null;

        public virtual ClientResult Client(BinaryContent content, RequestOptions options = null) => throw null;

        public virtual Task<ClientResult> ClientAsync(BinaryContent content, RequestOptions options = null) => throw null;

        public virtual ClientResult Client(Models.ClientModel body) => throw null;

        public virtual Task<ClientResult> ClientAsync(Models.ClientModel body, CancellationToken cancellationToken = default) => throw null;

        public virtual ClientResult Language(BinaryContent content, RequestOptions options = null) => throw null;

        public virtual Task<ClientResult> LanguageAsync(BinaryContent content, RequestOptions options = null) => throw null;

        public virtual ClientResult Language(CSModel body) => throw null;

        public virtual Task<ClientResult> LanguageAsync(CSModel body, CancellationToken cancellationToken = default) => throw null;
    }
}
