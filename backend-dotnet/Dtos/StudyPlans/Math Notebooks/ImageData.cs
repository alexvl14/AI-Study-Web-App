namespace backend_dotnet.Dtos.StudyPlans
{
    
    public record ImageData(byte[] Bytes, string MimeType);
    public record SavedImage (byte[] Bytes, string MimeType, string RelativePath);
}